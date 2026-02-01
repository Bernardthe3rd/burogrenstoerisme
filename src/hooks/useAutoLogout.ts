import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export const useAutoLogout = (minutes: number = 60) => {
    const navigate = useNavigate()

    useEffect(() => {
        // We gebruiken een lokale variabele voor de timer ID binnen dit effect
        let timerId: ReturnType<typeof setTimeout>

        // 1. De logica voor uitloggen
        const handleLogout = async () => {
            console.log(`Gebruiker inactief voor ${minutes} minuten. Uitloggen...`)
            await supabase.auth.signOut()
            navigate('/login')
            alert("Je bent automatisch uitgelogd wegens inactiviteit.")
        }

        // 2. De logica voor resetten
        const resetTimer = () => {
            if (timerId) clearTimeout(timerId)
            timerId = setTimeout(handleLogout, minutes * 60 * 1000)
        }

        // 3. Events definiëren
        const events = [
            'load', 'mousemove', 'mousedown',
            'click', 'scroll', 'keypress'
        ]

        // 4. Listeners koppelen
        events.forEach(event => {
            window.addEventListener(event, resetTimer)
        })

        // 5. Timer direct starten
        resetTimer()

        // 6. Opruimen (Cleanup) als de component verdwijnt
        return () => {
            if (timerId) clearTimeout(timerId)
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
        }

        // De dependency array bevat nu alleen externe waarden.
        // resetTimer en handleLogout zitten erbinnen, dus die hoeven hier niet bij.
    }, [navigate, minutes])
}
