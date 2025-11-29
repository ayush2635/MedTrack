const Record = require('../models/Record');

exports.saveRecord = async (req, res) => {
    try {
        const {
            reportDate,
            rawCandidates,
            interpretation,
            summary,
            modelMeta,
        } = req.body;

        const record = await Record.create({
            userId: req.user._id,
            reportDate,
            rawCandidates,
            interpretation,
            summary,
            modelMeta,
        });

        res.status(201).json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getHistory = async (req, res) => {
    const { testName } = req.params;

    try {
        const records = await Record.find({ userId: req.user._id }).sort({ reportDate: 1 });

        const history = records.map(record => {
            const test = record.interpretation.find(
                item => item.canonicalName.toLowerCase() === testName.toLowerCase()
            );

            if (test) {
                return {
                    date: record.reportDate,
                    value: test.value,
                    unit: test.unit,
                    flag: test.flag,
                };
            }
            return null;
        }).filter(item => item !== null);

        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllRecords = async (req, res) => {
    try {
        const records = await Record.find({ userId: req.user._id }).sort({ reportDate: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getRecordById = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (record && record.userId.toString() === req.user._id.toString()) {
            res.json(record);
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Check user ownership
        if (record.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await record.deleteOne();
        res.json({ message: 'Record removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
