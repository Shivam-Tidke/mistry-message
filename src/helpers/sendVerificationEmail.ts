import VerificationEmail from "@/emails/VerificationEmail";
import { resend } from "../lib/resend";
import { ApiResponse } from "../types/ApiResponse";

export async function snedVerificationEmail(email:string, username:string, verifyCode: string) :Promise<ApiResponse> {
    
    try {
        const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystry message | Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

        
        return{success:true, message: "verification email send successfully "}
    } catch (emaillError) {
        console.log("Error sneding verification email", emaillError)
        return{success: false, message: "failed to send vefication email"}
    }
}