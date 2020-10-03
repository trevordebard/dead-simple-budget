import React from 'react'
import { signIn, signOut, useSession } from 'next-auth/client'

export default function Page() {
    const [session, loading] = useSession()
    if (loading) return null
    return <>
        {!session && <>
            Not signed in <br />
            <button onClick={() => signIn('google')}>Sign in</button>
        </>}
        {session && <>
            Signed in as {session.user.email} <br />
            <button onClick={signOut}>Sign out</button>
        </>}
    </>
}