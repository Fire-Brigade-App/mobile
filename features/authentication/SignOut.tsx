import React, { FC, useState } from "react";
import { signOut } from "./auth";
import TextButton from "../../components/TextButton";

export const SignOut: FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
  };

  return (
    <>
      <TextButton loading={loading} onPress={handleLogout} title="Sign out" />
    </>
  );
};
