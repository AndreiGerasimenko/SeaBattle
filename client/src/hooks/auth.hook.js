import { useCallback, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { setToken, setRefreshToken, setUserID } from "../redux/actions";

const storageName = "userStorage";

export const useAuth = () => {
    const dispatch = useDispatch();

    const login = useCallback((jwtToken, jwtRefreshToken, id) => {
        dispatch(setToken(jwtToken));
        dispatch(setUserID(id));
        dispatch(setRefreshToken(jwtRefreshToken));

        localStorage.setItem(storageName, JSON.stringify({ 
            userId: id, token: jwtToken, refreshToken: jwtRefreshToken
        }));
    }, [dispatch]);


    const logout = useCallback(() => {
        dispatch(setToken(null));
        dispatch(setUserID(null));
        dispatch(setRefreshToken(null));
        localStorage.removeItem(storageName);
    }, [dispatch]);

    useEffect(() => {
        const storageContent = JSON.parse(localStorage.getItem(storageName));

        if(storageContent && storageContent.token) {
            login(storageContent.token, storageContent.refreshToken, storageContent.userId);
        }
    }, [login]);

    return { login, logout };

}