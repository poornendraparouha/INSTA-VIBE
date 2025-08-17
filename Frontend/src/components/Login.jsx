import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { setFollowing } from "@/redux/followSlice";

export default function Login() {
	const [input, setInput] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const changeEventHandeler = (e) => {
		setInput({ ...input, [e.target.name]: e.target.value });
	};
	const signupHandler = async (e) => {
		e.preventDefault();
		try {
			setLoading(true);
			const res = await axios.post("http://localhost:8000/api/v1/user/login", input, {
				headers: {
					"Content-Type": "application/json",
				},
				withCredentials: true,
			});
			if (res.data.success) {
				dispatch(setAuthUser(res.data.user));
				dispatch(setFollowing(res.data.user.following))
				navigate("/");
				toast.success(res.data.message);
				setInput({
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
		<div className="flex items-center justify-center w-screen h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-yellow-200">
			<form
				onSubmit={signupHandler}
				className=" bg-black/30 backdrop-blur-md rounded-2xl shadow-lg flex flex-col gap-5 p-8 w-[90%] max-w-md"
			>
				<div className="mb-2 text-center">
					<img src="/instagram.png" alt="logo" className="w-[60px] h-[60px] mx-auto" />
					<h1 className="font-extrabold text-3xl bg-gradient-to-r from-pink-300 via-purple-300 to-yellow-300 bg-clip-text text-transparent mb-2">
						Instagram
					</h1>
					<p className="text-sm text-gray-300 px-4">Login to use my instagram clone</p>
				</div>

				<div>
					<Label className="font-medium text-gray-100 tracking-wide" htmlFor="email">
						Email address
					</Label>
					<Input
						type="email"
						name="email"
						autoComplete="email"
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
					<Button type-="submit">Login</Button>
				)}
				<span className="text-center text-sm text-gray-300 px-4">
					Don&apos;t have an account?{" "}
					<Link to="/signup" className="text-blue-600 hover:underline">
						Signup
					</Link>
				</span>
			</form>
		</div>
	);
}
