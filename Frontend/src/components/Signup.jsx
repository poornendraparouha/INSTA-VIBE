import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function Signup() {
	const [input, setInput] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const changeEventHandeler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};
	const signupHandler = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await axios.post(
				"http://localhost:8000/api/v1/user/register",
				input,
				{
					headers: {
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			);
			if (res.data.success) {
				navigate("/login");
				toast.success(res.data.message);
				setInput({
					username: "",
					email: "",
					password: "",
				});
			}
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex items-center w-screen h-screen justify-center">
			<form
				onSubmit={signupHandler}
				className="shadow-lg flex flex-col gap-5 p-8"
			>
				<div className="my-4">
					<h1 className="text-center font-bold text-xl">LOGO</h1>
					<p className="text-sm text-center">
						Signup to see photos and vidios from your friends
					</p>
				</div>
				<div>
					<Label className="font-medium " htmlFor="username">
						Username
					</Label>
					<Input
						type="text"
						name="username"
						value={input.username}
						onChange={changeEventHandeler}
						className="focus-visible:ring-transparent my-2"
						placeholder="Enter a username"
					/>
				</div>
				<div>
					<Label className="font-medium" htmlFor="email">
						Email address
					</Label>
					<Input
						type="email"
						name="email"
						value={input.email}
						onChange={changeEventHandeler}
						className="focus-visible:ring-transparent my-2"
						placeholder="Enter your email"
					/>
				</div>
				<div>
					<Label className="font-medium" htmlFor="password">
						Password
					</Label>
					<Input
						type="password"
						name="password"
						value={input.password}
						onChange={changeEventHandeler}
						className="focus-visible:ring-transparent my-2"
						placeholder="Enter password"
					/>
				</div>
				{loading ? (
					<Button>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						PLease wait
					</Button>
				) : (
					<Button type-="submit">Sign Up</Button>
				)}
				<span className="text-center">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-600">
						Login
					</Link>
				</span>
			</form>
		</div>
	);
}
