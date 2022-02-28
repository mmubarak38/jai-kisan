const cardModel = require('../models/cardModel')
const customerModel= require('../models/customerModel')

const createCard = async (req, res) => {

    try {
        const requestBody = req.body

        
        let {
            cardType,
            customerName,
            status,
            vision,
            customerID
        } = requestBody

       const checkCustomerID= await customerModel.findOne({customerID})
       if(!checkCustomerID){
           res.status(400).send({status:false, msg:`please provide valid customerID `})
       }
    
        const checkCardList = await cardModel.find()
        const length = checkCardList.length
        let details = {cardNumber: 100+length+1,cardType,customerName,status,vision,customerID}

        data = await cardModel.create(details)

        res.status(201).send({ status: true, msg: "card successfully created", data })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

const getCardList = async (req, res) => {
    try {

const list = await cardModel.find({status:"ACTIVE"})
res.status(200).send({ status: true, msg: "card successfully created", list })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}


module.exports = { createCard ,getCardList}