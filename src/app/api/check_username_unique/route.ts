import dbConnect from "@/src/lib/dbConnect";
import { z} from "zod";
import { usernameValidation } from "@/src/schemas/signUpSchema";
import UserModel from "@/src/model/User";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();
    try {
        const {searchParams}  = new URL(request.url)
        const queryParams = {
            username: searchParams.get("username")
        }   
        //validate with zod
        const result = usernameQuerySchema.safeParse(queryParams)
        console.log("Result of validation:", result) // todo: remove this after testing
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(','):  "Invalid username"
            })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified: true})
        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:"Username is already takan", 
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"username is unique",

        }, {status: 400})

    } catch (error) {
        console.error("error Checking username uniqueness", error)
        return Response.json(
            {
            success:false,
            message: "error checking username uniqueness"

        }, {status:500}
    )
}
}