import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/User";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json()

        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found"

                }, { status: 500 }
            )
        }
        const isCodeValide = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValide && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"

                }, { status: 200 }
            )
        } else if (!isCodeNotExpired) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired , please sign up again to receive a new code"

                }, { status: 400 }
            )
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Invalide verification code"

                }, { status: 500 }
            )
        }

    } catch (error) {
        console.error("error in verifying code", error)
        return Response.json(
            {
                success: false,
                message: "error in verifying code"

            }, { status: 500 }
        )
    }
}
