const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const resultsRouter = require('express').Router()
const helper = require('../utils/helper')
const RESULT_URL = require('../utils/config').RESULT_URL
const { AllResults, ExamDefId }  = require('./mongo')

resultsRouter.post('/', async (request, response) => {
    const { registerNo, dob } = request.body
    if (registerNo === '' || registerNo === undefined) {
        return response.status(400).json({ error: 'register number is missing' })
    }
    const batchYear = helper.extractBatch(registerNo)
    if (batchYear === undefined || !batchYear) {
        return response.status(400).json({ error: 'invalid register number' })
    }

    try {
        const examDefIds = await ExamDefId.findOne({ batchYear })
        if (examDefIds === null) {
            let examDefIdFound = []
            const results = []
            for (let i = 500; i < 1050; i++) {
                try {
                    const body = {
                        registerNo,
                        dob,
                        examDefId: String(i),
                        schemeId: '1'
                    }
                    const apiResponse = await fetch(RESULT_URL, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: {'Content-Type': 'application/json'}
                    })
                    const data = await apiResponse.json()
                    if (apiResponse.status === 200) {
                        examDefIdFound.push(String(i))
                        results.push(data)
                        console.log(String(i));
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            
            const newData = new ExamDefId({
                batchYear: batchYear,
                examDefId: examDefIdFound
            })
            newData.save()

            const cleanedData = helper.cleanData(results)
            response.json(cleanedData)
        } else {
            const results = []
            for(const id of examDefIds.examDefId) {
                try {
                    const body = {
                        registerNo,
                        dob,
                        examDefId: String(id),
                        schemeId: '1'
                    }
                    const apiResponse = await fetch(RESULT_URL, {
                        method: 'POST',
                        body: JSON.stringify(body),
                        headers: {'Content-Type': 'application/json'}
                    })
                    const data = await apiResponse.json()

                    if (apiResponse.status === 200) {
                        results.push(data)
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            const cleanedData = helper.cleanData(results)
            response.json(cleanedData)
        }
    } catch (error) {
        console.log(error);
    }
})

resultsRouter.post('/update', async (request, response) => {
    const { registerNo, semester, examDefId, oldResult } = request.body
    if (registerNo === '' || registerNo === undefined) {
        return response.status(400).json({ error: 'register number is missing' })
    }
    if (semester === '' || semester === undefined) {
        return response.status(400).json({ error: 'semester is missing' })
    }
    if (examDefId === '' || examDefId === undefined) {
        return response.status(400).json({ error: 'examDefId is missing' })
    }

    var fetchedExamDefIds = await AllResults.findOne({ semester, program: "B.Tech" });
    for (const id of fetchedExamDefIds.examDefId) {
        if (id > examDefId) {
            try {
                const body = {
                    registerNo: registerNo,
                    dob: "",
                    examDefId: String(id),
                    schemeId: '1'
                }
                const apiResponse = await fetch(RESULT_URL, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                })
                const data = await apiResponse.json()
                if (apiResponse.status === 200) {
                    const cleanedData = helper.cleanSupplyData(data, oldResult)
                    // console.log(cleanedData)
                    response.status(200).json(cleanedData)
                } else {
                    response.status(400).json({ error: 'no data found' })
                }
            } catch (error) {
                console.log(error);
            }
        }
    }
    return null;
})

module.exports = resultsRouter
