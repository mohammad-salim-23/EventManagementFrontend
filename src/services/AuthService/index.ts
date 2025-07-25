/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";


export const registerUser = async(userData: FieldValues)=>{
    try{
     
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body: JSON.stringify(userData),
        })
        const result = await res.json();
        if(res.ok){
            return {success:true, data: result , message:"Registration successful"};
        }else{
            return {success:false, message: result.message || "Registration failed"}
        }
    }catch(error: any){
        console.error("Register Error:", error);
        return {success: false, message:error.message}
    }
}
//login 
export const loginUser = async(userData: FieldValues)=>{
    try{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json",

        },
        body:JSON.stringify(userData)
    });

    const result = await res.json();

    if(res.ok && result.token){
        (await cookies()).set("accessToken",result.token);
        return {success: true, message: "Login successful", data: result};

    }
    return {success: false, message:result.message || "Login failed"};
    }catch(error:any){
        console.error("Login Error: ",error);
        return {success:false , message: error.message};
    }

}

export const getProfile = async()=>{
    try{
      
        const accessToken = (await cookies()).get("accessToken")?.value;

        if(!accessToken){
            return {success: false, message: "No token found"}
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/users/profile`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache:"no-store"
        });
        const data = await res.json();

        if(!res.ok){
            return {success:false , message: data.message || "Failed to fetch profile"};
        }
        return {success:true , data};
    }catch (error: any) {
    console.error("Profile Fetch Error:", error);
    return { success: false, message: error.message };
  }
}

export const logout = async ()=>{
    (await cookies()).delete("accessToken");
    return {success: true , message : "Logged out successfully"};
}