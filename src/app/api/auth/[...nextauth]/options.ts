import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import myDbConnection from "@/lib/myDbConnection";
import UserModel from "@/model/user.model";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/lib/mongoConnect";
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise) as Adapter,
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
    // add another provide like google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
};
