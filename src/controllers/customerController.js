const customerModel = require('../models/customerModel')
const { v4: uuidv4 } = require('uuid');

// Create new customer

const createCustomer = async (req, res) => {
    try {
        let requestBody = req.body;
        let {
            firstName,
            lastName,
            mobileNumber,
            DOB,
            emailID,
            address,
            customerID,
            status
        } = requestBody

        //searching phone in DB to maintain its uniqueness
        const isMObileNumberAleadyUsed = await customerModel.findOne({ mobileNumber })
        if (isMObileNumberAleadyUsed) {
            return res.status(400).send({
                status: false,
                message: `${mobileNumber} is already in use, Please try a new phone number.`
            })
        }

        //validating phone number of 10 digits only.
        if (!(/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobileNumber))) return res.status(400).send({ status: false, message: "mobileNumber number must be a valid Indian number." })

        //searching email in DB to maintain its uniqueness
        const isEmailAleadyUsed = await customerModel.findOne({ emailID })
        if (isEmailAleadyUsed) {
            return res.status(400).send({
                status: false, message: `${emailID} is alraedy in use. Please try another email Id.`
            })
        }

        //validating email using RegEx.
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailID))
            return res.status(400).send({ status: false, message: "Invalid Email id." })


        let uuid = uuidv4()

        const customerData = {
            firstName,
            lastName,
            mobileNumber,
            DOB,
            emailID,
            address,
            customerID: uuid,
            status
        }

        savedData = await customerModel.create(customerData)
        return res.status(201).send({ status: true, message: "customer successfully created", data: savedData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const customerList = async function (req, res) {
    try {
       let list = await customerModel.find({ status: "ACTIVE" })
        return res.status(200).send({ status: true, message: "customer list", data: list })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}



const deleteCustomer = async function (req, res) {
    try {
        let customerID = req.params._id 

        let checkCustomer = await customerModel.findOne({ _id: customerID  });

        if (!checkCustomer) {
          return res.status(404).send({ status: false, msg: `please provide valid ${customerID}`});
        }
     
       let deletedData = await customerModel.findOneAndUpdate({ _id: customerID }, { status: "INACTIVE", isDeleted: true },{new:true} )
        return res.status(200).send({ status: true, message: "successfully deleted", data: deletedData })

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { createCustomer, customerList, deleteCustomer }

