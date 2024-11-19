import { ProfileType } from "../model/model";
import { config } from "dotenv";
config()

const MIN_TRANSACTION_AMOUNT = Number(process.env.MIN_TRANSACTION_AMOUNT)

export function isProfileTypeContractor(type: any): type is ProfileType.CONTRACTOR {
    return type === ProfileType.CONTRACTOR;
}

export function validPaymentDate(paymentDate: string): boolean {
    const paymentDateObj = new Date(paymentDate);
  
    if (isNaN(paymentDateObj.getTime())) {
      console.log("Invalid payment date format.");
      return false;
    }
  
    const currentDate = new Date();
  
    if (paymentDateObj < currentDate) {
      console.log("The payment date cannot be in the past.");
      return false;
    }
  
    return true;
}
  
export function validateAmount(amount: number){
    const minAmount = isNaN(MIN_TRANSACTION_AMOUNT) ? 0.01 : MIN_TRANSACTION_AMOUNT;

    if(amount<minAmount){
        throw new Error (`Amount Can't less than: ${minAmount}`)
    } else if (amount<0){
        throw new Error ("Amount Can't be a negative value")
    }
    return true
}