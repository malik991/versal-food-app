import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import myDbConnection from "@/lib/myDbConnection";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "malik@gmial.com ",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          await myDbConnection();
          const getUser = await UserModel.findOne({
            email: credentials.email,
          });
          console.log("credential: ", credentials.email);

          if (!getUser) {
            throw new Error("no user found");
          }

          // for password we have to use like this credentials.password
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            getUser.password
          );
          if (!isPasswordCorrect) {
            throw new Error("password is incorrect");
          } else {
            return getUser;
          }
        } catch (error: any) {
          throw new Error(error);
        }
      },
    }),
    // add another provide like git hub
  ],

  secret: process.env.NEXTAUTH_SECRET,
};
