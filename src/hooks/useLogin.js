import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { backendUri} from '../constants/constants';

export const useLogin = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();
    try {
        const login = async (email, password) => {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${backendUri}/api/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const json = await response.json();

            if (!response.ok) {
                setIsLoading(false);
                setError(json.error);
            }

            if (response.ok) {
                // save the user to local storage
                localStorage.setItem('user', JSON.stringify(json));

                // update the auth context
                dispatch({ type: 'LOGIN', payload: json });

                setIsLoading(false);
            }
        }

        return { login, isLoading, error }
    } catch (e) {
        return e
    }

}