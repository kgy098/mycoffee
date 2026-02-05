"use client"

import { useState } from "react";
import RegisterButton from "./components/RegisterButton";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-5 rounded-2xl shadow">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        Foydalanuvchini ro‘yxatdan o‘tkazish
      </h2>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <RegisterButton
          email={email}
          password={password}
          onVerificationComplete={(data) => {
            console.log("Verified data:", data);
          }}
          onRegisterSuccess={() => {
            console.log("Register success");
            // Redirect yoki boshqa amallar
          }}
          onRegisterError={(error) => {
            console.error("Register error:", error);
          }}
        />
      </div>
    </div>
  );
}
