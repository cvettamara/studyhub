"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { GraduationCap, CheckCircle, XCircle, Loader2 } from "lucide-react"
import API from "@/lib/api"

export default function VerifyEmailPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const hasVerified = useRef(false)

    useEffect(() => {
        if (!token) {
            setStatus("error")
            return
        }

        if (hasVerified.current) return
        hasVerified.current = true

        API.get(`/auth/verify-email?token=${token}`)
            .then(() => setStatus("success"))
            .catch(() => setStatus("error"))
    }, [token])

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
                <GraduationCap className="mx-auto h-10 w-10 text-orange-500" />

                {status === "loading" && (
                    <>
                        <Loader2 className="mx-auto mt-6 h-10 w-10 animate-spin text-slate-400" />
                        <p className="mt-4 text-slate-600">Се потврдува твојот email...</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="mx-auto mt-6 h-12 w-12 text-emerald-500" />
                        <h1 className="mt-4 text-xl font-bold text-slate-800">Email потврден!</h1>
                        <p className="mt-2 text-slate-500">Сега можеш да се најавиш на твојата сметка.</p>
                        <Link
                            href="/login"
                            className="mt-6 inline-block rounded-lg bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 font-semibold text-white shadow-md"
                        >
                            Оди на најава
                        </Link>
                    </>
                )}

                {status === "error" && (
                    <>
                        <XCircle className="mx-auto mt-6 h-12 w-12 text-red-500" />
                        <h1 className="mt-4 text-xl font-bold text-slate-800">Линкот не важи</h1>
                        <p className="mt-2 text-slate-500">Линкот е невалиден или веќе искористен.</p>
                        <Link href="/register" className="mt-6 inline-block text-orange-500 underline">
                            Регистрирај се повторно
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}