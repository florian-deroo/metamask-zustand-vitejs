import { useEffect } from "react";
import { useAccountStore } from "../store/account";

export default function Home() {

  const accountStore = useAccountStore()

  accountStore.init()

  useEffect(() => {
    console.log(accountStore.chainID)
  }, [accountStore.chainID])

  return (
    <div>
      {!accountStore.isConnected ? (
        <button onClick={() => accountStore.connect()}>connect</button>
      ) : (
        <></>
      )}
    </div>
  );
}
