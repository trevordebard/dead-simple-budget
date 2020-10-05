import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page() {
    const [session, loading] = useSession()
    if (loading) return null
    const signInUser = async () => {
        const data = await signIn('google')
        console.log(data)
    }
    return <>
        {!session && <>
            Not signed in <br />
            <button onClick={signInUser}>Sign in</button>
        </>}
        {session && <>
            Signed in as {session.user.email} <br />
            <button onClick={signOut}>Sign out</button>
        </>}
    </>
}