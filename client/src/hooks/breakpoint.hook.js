import { useState, useCallback } from "react";
import { useMediaQuery } from "react-responsive";

export const useBreakPoint = (breakPoint = 635) => {
    const [chatShown, setChatShown] = useState(false);

    const onChangeScreen = () => {
        setChatShown(false);
    };

    const isSmScreenSize = useMediaQuery(
        { maxWidth: breakPoint },
        undefined,
        onChangeScreen
    );

    const onCloseDrawer = useCallback(() => setChatShown(false), [setChatShown]);
    const openChat = useCallback(() => setChatShown(true), [setChatShown]);

    return {
        chatShown,
        isSmScreenSize,
        onCloseDrawer,
        openChat
    }
}