import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";
import bcrypt from "bcryptjs";
import { snedVerificationEmail } from "@/src/helpers/sendVerificationEmail";
import { email, success } from "zod";

export async function POST(request: Request) {
    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingUserVerifiedByUsername = await UserModel.findOne(
            {
                username, isVerified: true

            })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        const ExistingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (ExistingUserByEmail) {
            if(ExistingUserByEmail.isVerified){
                 return Response.json({
                success: false,
                message: "User already exits with this email"
            }, { status: 400 })
            } else{
                const hashedPassword = await bcrypt.hash(password, 10)
                ExistingUserByEmail.password = hashedPassword;
                ExistingUserByEmail.verifyCode = verifyCode;
                ExistingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3000000)
               await ExistingUserByEmail.save()
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)


            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })

            await newUser.save()
        }

        //send verification email

        const emailResponse = await snedVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }


        return Response.json({
            success: true,
            message: "User registered successfully, please verify your email"
        }, { status: 500 })



    } catch (error) {
        console.error('Error registering user', error)
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}