import React from "react";
import { Phone, User } from "lucide-react";

export default function Page() {
  return (
    <main className="blp_prop">
      <div className="min-h-screen bg-black text-white flex">
        <div className="flex-1 p-8">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold mb-12">NOT Bloomberg</h1>

            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Login Name</label>
                <input
                  type="text"
                  className="w-full bg-[#ff9e2a] text-black px-3 py-1 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Password</label>
                <input
                  type="password"
                  className="w-full bg-[#ff9e2a] text-black px-3 py-1 text-sm font-mono"
                />
              </div>

              <button className="bg-neutral-600 text-white px-6 py-2 text-sm hover:bg-neutral-500 transition-colors">
                Login
              </button>
            </div>

            <div className="mt-8">
              <a href="#" className="text-cyan-400 hover:text-cyan-300 text-sm">
                Forgot Login Name or Password?
              </a>
            </div>

            <div className="mt-12 space-y-2">
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2" />
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Contact Us
                </a>
              </div>
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2" />
                <a href="#" className="text-cyan-400 hover:text-cyan-300">
                  Create a New Login
                </a>
              </div>
            </div>

            <div className="mt-16 text-xs text-neutral-400 space-y-1">
              <p>
                S/N XXXXXX-X | SID XXXXXXX-X | Version XX XXX XX | Netid XXXX
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-lg">
            <h2 className="text-lg mb-6">
              Select Language for Analytics and Communication Functions:
            </h2>

            <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
              <div>
                <div className="mb-1">▶ English</div>
                <div className="text-orange-400">Español</div>
                <div className="text-orange-400">Français</div>
                <div className="text-orange-400">Deutsch</div>
              </div>
              <div>
                <div className="text-orange-400">Português</div>
                <div className="text-orange-400">Italiano</div>
                <div className="text-orange-400">繁體中文</div>
              </div>
              <div>
                <div className="text-orange-400">한국어</div>
                <div className="text-orange-400">简体中文</div>
                <div className="text-orange-400">Русский</div>
              </div>
            </div>

            <div className="mt-8 text-sm">
              <p>To customize your language experience</p>
              <p>type LANG &lt;GO&gt; after login.</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-8 right-8 text-xs text-neutral-400 leading-relaxed">
          <p>Insert Disclaimer</p>
        </div>
      </div>
    </main>
  );
}
