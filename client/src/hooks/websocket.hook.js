import { useEffect, useState, useMemo } from "react";
import { useSelector } from 'react-redux';
import { useAuth } from "../hooks/auth.hook";
import { useHttp } from "../hooks/http.hook";

export const useWebsocket = ({ 
    url, 
    name, 
    onMessageCallback, 
    opponentId,
    onWSClose }) => {
    const { token, refreshToken, userId } = useSelector(state => state.auth);
    const [wsConnection, setWsConnection] = useState(null);
    const { logout, login } = useAuth();
    const { request } = useHttp();

    const connectToWs = useMemo(() => {
        return new WebSocket(`${url}?token=${token}&opponentId=${opponentId}`);
    }, [url, token, opponentId]);

    useEffect(() => {
        if(!wsConnection) {
            setWsConnection(connectToWs);
            console.log(`Connection reseted ${name}` , connectToWs);
        }       
    }, [connectToWs, wsConnection, name]);

    useEffect(() => {
        return () => {
            if(wsConnection && wsConnection.readyState === WebSocket.OPEN) {
                wsConnection.close(1000);
            }
        }
    }, [wsConnection])

    useEffect(() => {
        if(wsConnection) {
            wsConnection.onclose = async (event) => {
                if(typeof(onWSClose) == "function" ) {
                    onWSClose(event);
                }
                console.log(`connection ${name} is closed`, event.code);
                if(event.code === 1008) {
                    try {
                        const data = await request(
                                                    "/api/auth/refresh", 
                                                    "POST", 
                                                    JSON.stringify({refreshToken}), 
                                                    { "Content-Type": "application/json"}
                                                   );
                        login(data.token, data.refreshToken, userId);
                      } catch(error){
                        logout();
                      }
                } else if(event.code === 1006) {
                    logout();
                } 
            }
            
            wsConnection.onopen = () => {
                console.log(`Connected to ${name}`);
            }
            
            wsConnection.onmessage = onMessageCallback;
        }
    }, [
        wsConnection,
        login,
        logout,
        request,
        userId,
        refreshToken,
        name,
        onMessageCallback,
        onWSClose
    ]);

    return { wsConnection };
}