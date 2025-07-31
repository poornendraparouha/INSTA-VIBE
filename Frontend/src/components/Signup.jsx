import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from "axios";


export default function Signup() {
    const [input, setInput] = useState({
        username:"",
        email:"",
        password:""
    })
    const changeEventHandeler = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }
    const signupHandler = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/v1/user/register', input, {
                headers:{
                    "Content-Type":'application/json'
                },
                withCredentials:true
            });
            if(res.data.success){
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }
	return (
		<div className="flex items-center w-screen h-screen justify-center">
			<form onSubmit={signupHandler} className="shadow-lg flex flex-col gap-5 p-8">
				<div className="my-4">
					<h1 className="text-center font-bold text-xl">LOGO</h1>
					<p className="text-sm text-center">Signup to see photos and vidios from your friends</p>
				</div>
				<div>
					<Label className="font-medium " htmlFor="username">
						Username
					</Label>
					<Input type="text" name="username" value={input.username} onChange={changeEventHandeler} className="focus-visible:ring-transparent my-2" placeholder="Enter a username" />
				</div>
				<div>
					<Label className="font-medium" htmlFor="email">
						Email address
					</Label>
					<Input type="email" name="email" value={input.email} onChange={changeEventHandeler} className="focus-visible:ring-transparent my-2" placeholder="Enter your email"/>
				</div>
				<div>
					<Label className="font-medium" htmlFor="password">
						Password
					</Label>
					<Input type="password" name="password" value={input.password} onChange={changeEventHandeler} className="focus-visible:ring-transparent my-2" placeholder="Enter password" />
				</div>
                <Button type-="submit" >Sign Up</Button>
			</form>
		</div>
	);
}
