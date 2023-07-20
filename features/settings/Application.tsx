import { StyleSheet, Text, View } from "react-native";
import React, { FC, useEffect, useState } from "react";
import * as Application from "expo-application";
import * as Linking from "expo-linking";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { titleStyle } from "../../styles/title";
import { contentStyle } from "../../styles/content";
import packageJson from "../../package.json";
import { linkStyle } from "../../styles/link";
import TextButton from "../../components/TextButton";

interface Version {
  timestamp: FirebaseFirestoreTypes.Timestamp;
  url: string;
  version: string;
}

const ApplicationPage: FC = () => {
  const version = Application.nativeApplicationVersion;
  const build = Application.nativeBuildVersion;
  const [latestVersion, setLatestVersion] = useState<Version>(null);
  const [loading, setLoading] = useState(false);

  const checkForUpdates = async () => {
    setLoading(true);
    const currentVersionRef = await firestore()
      .collection("versions")
      .where("version", "==", version)
      .limit(1)
      .get();
    const currentVersionData = currentVersionRef.docs[0].data() as Version;
    const currentVersionTimestamp = currentVersionData.timestamp;
    const latestVersionRef = await firestore()
      .collection("versions")
      .where("timestamp", ">", currentVersionTimestamp)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    if (!latestVersionRef.empty) {
      setLatestVersion(latestVersionRef.docs[0].data() as Version);
    } else {
      setLatestVersion(currentVersionData);
    }

    setLoading(false);
  };

  useEffect(() => {
    setLatestVersion(null);
  }, []);

  return (
    <View style={styles.content}>
      <View style={styles.section}>
        <Text style={styles.title}>Fire Brigade</Text>
        <Text>{packageJson.description}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Version</Text>
        <Text>
          {version}.{build}
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Contribute</Text>
        <Text
          style={styles.link}
          onPress={() => Linking.openURL(packageJson.repository)}
        >
          View on GitHub
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Updates</Text>
        <TextButton
          onPress={checkForUpdates}
          title="Check for updates"
          align="left"
          loading={loading}
        />
        {latestVersion &&
          (latestVersion.version === version ? (
            <Text>You have the latest version installed</Text>
          ) : (
            <>
              <Text>
                The newest version is available ({latestVersion.version})
              </Text>
              <TextButton
                onPress={() => Linking.openURL(latestVersion.url)}
                title="Download update"
                align="left"
              />
            </>
          ))}
      </View>
    </View>
  );
};

export default ApplicationPage;

const styles = StyleSheet.create({
  content: contentStyle,
  title: titleStyle,
  link: linkStyle,
  section: {
    marginBottom: 20,
  },
});
