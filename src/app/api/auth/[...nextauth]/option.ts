import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import UserModel from "@/src/model/User";
import dbConnect from "@/src/lib/dbConnect";

export const authOptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {
                username: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect()
                try {

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error('No user found with this email')
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your accout before login')
                    }

                    const isPasswordCorrect =  await  bcrypt.compare(credentials.password, user.password)

                    if (!isPasswordCorrect) {
                        return user
                    }else{
                        throw new Error ("Incorrect password")
                    }

                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ]

}