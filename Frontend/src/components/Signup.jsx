import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";

export default function Signup() {
	const [input, setInput] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const {user} = useSelector(store => store.auth);
	const navigate = useNavigate();
	const changeEventHandeler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};
	const signupHandler = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await axios.post("https://insta-vibe-production.up.railway.app/api/v1/user/register", input, {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			});
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
	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, []);
	return (
		<div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-yellow-200">
			<form
				onSubmit={signupHandler}
				className=" bg-black/30 backdrop-blur-md rounded-2xl shadow-lg flex flex-col gap-5 p-8 w-[90%] max-w-md"
			>
				<div className="mb-2 text-center">
					<img src="/logo.png" alt="logo" className="w-[60px] h-[60px] mx-auto" />
					<h1 className="font-extrabold text-3xl bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent mb-2">
						INSTA VIBE
					</h1>
					<p className="text-sm text-gray-300 px-4">Login to use my insta vibe app</p>
				</div>
				<div>
					<Label className="font-medium text-gray-100 tracking-wide" htmlFor="username">
						Username
					</Label>
					<Input
						type="text"
						name="username"
						value={input.username}
						onChange={changeEventHandeler}
						className="my-2 bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-lg"
						placeholder="Enter a username"
					/>
				</div>
				<div>
					<Label className="font-medium text-gray-100 tracking-wide" htmlFor="email">
						Email address
					</Label>
					<Input
						type="email"
						name="email"
						value={input.email}
						onChange={changeEventHandeler}
						className="my-2 bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-lg"
						placeholder="Enter your email"
					/>
				</div>
				<div>
					<Label className="font-medium text-gray-100 tracking-wide" htmlFor="password">
						Password
					</Label>
					<Input
						type="password"
						name="password"
						value={input.password}
						onChange={changeEventHandeler}
						className="my-2 bg-black/40 border border-gray-600 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-1 focus:ring-pink-400 rounded-lg"
						placeholder="Enter password"
					/>
				</div>
				{loading ? (
					<Button>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						PLease wait
					</Button>
				) : (
					<Button type="submit">Sign Up</Button>
				)}
				<span className="text-center text-sm text-gray-300 px-4">
					Already have an account?{" "}
					<Link to="/login" className="text-blue-600 hover:underline">
						Login
					</Link>
				</span>
			</form>
		</div>
	);
}
