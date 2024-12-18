import axios from 'axios'
import { createHash } from 'crypto'
import { variables } from '../config/envLoader'
import AnotherError from '../utils/errors/anotherError'
import express from 'express'
import { createError } from '../utils/errors/createError'

const saltIndex = 1

const saltKey = variables.PHONEPE_PAYMENT_SALT_KEY

const apiEndPoint = '/pg/v1/pay'

export const initPayment = async (transactionId: string, amount: number, next:express.NextFunction,phone?: string) => {
  try {
    const amountToPay = 100 * amount

    console.log('Amount to pay: ', amountToPay)

    const paymentPayload = {
      merchantId: variables.PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: variables.PHONEPE_MERCHANT_USER_ID,
      amount: amountToPay,
      redirectUrl: `${variables.BASE_URL}/api/v1/checkout/redirect`,
      redirectMode: 'POST',
      callbackUrl: `${variables.BASE_URL}/api/v1/checkout/callback`,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    }

    const base64EncodedPayload = Buffer.from(JSON.stringify(paymentPayload)).toString('base64')

    const string = base64EncodedPayload + apiEndPoint + saltKey

    const sha256 = createHash('sha256').update(string).digest('hex')

    const checksum = sha256 + '###' + saltIndex

    const options = {
      method: 'post',
      url: variables.PHONEPE_PAY_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Verify': checksum,
        'X-CALLBACK-URL': paymentPayload.callbackUrl,
      },
      data: {
        request: base64EncodedPayload,
      },
    }

    const result = await axios.request(options)

    return result.data
  } catch (error) {
    if (error) {
      console.log(error)
        return next(createError({status:400,message:"something went wrong"}))
    }
  }
}

export const checkStatus = async (transactionId: string) => {
  const paymentPayload = {
    merchantId: variables.PHONEPE_MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: variables.PHONEPE_MERCHANT_USER_ID,
    redirectUrl: `${variables.BASE_URL}/api/v1/checkout/redirect`,
    redirectMode: 'POST',
    callbackUrl: `${variables.BASE_URL}/api/v1/checkout/callback`,
    paymentInstrument: {
      type: 'PAY_PAGE',
    },
  }

  const string = 'pg/v1/status/' + paymentPayload.merchantId + '/' + paymentPayload.merchantTransactionId + saltKey

  const sha256 = createHash('sha256').update(string).digest('hex')

  const checksum = sha256 + '###' + saltIndex
  console.log(checksum)
  const options = {
    method: 'GET',
    url: variables.PHONEPE_STATUS_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': `${variables.PHONEPE_MERCHANT_ID}`,
    },
  }

  const result = await axios.request(options)

  return result.data
}
