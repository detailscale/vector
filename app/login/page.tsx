"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // USAGE: submitted password goes to a var studentId, password
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 text-neutral-300 font-outfit">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-800 text-neutral-200 rounded-lg mb-4">
            PS
          </div>
          <h1 className="text-2xl text-neutral-100">Welcome back</h1>
          <p className="text-neutral-400">Sign in to your student account</p>
        </div>

        <Card className="bg-neutral-800 border border-neutral-700">
          <CardHeader>
            <CardTitle className="text-xl text-neutral-100 font-normal">
              Sign in to order
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter your student credentials start ordering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="studentId" className="text-sm text-neutral-300">
                  Student ID
                </Label>
                <Input
                  id="studentId"
                  type="text"
                  placeholder="Your 5 digits student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="h-11 bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-neutral-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password starts with pass@...."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-500 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign in
              </Button>
            </form>

            <div className="mt-4 text-center">
              <span className="text-sm text-neutral-400">
                Something went wrong?{" "}
                <a
                  href="#"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Request support
                </a>
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <p className="text-xs text-neutral-500">
            By signing in, you agree to our{" "}
            <a
              href="#"
              className="hover:underline text-neutral-400 hover:text-neutral-300"
            >
              something
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="hover:underline text-neutral-400 hover:text-neutral-300"
            >
              something
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
