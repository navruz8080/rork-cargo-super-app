import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
  Image,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Star, Camera, X } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Colors } from "@/constants/colors";

export default function WriteReviewScreen() {
  const { cargoId, cargoName } = useLocalSearchParams<{ cargoId: string; cargoName: string }>();
  const { t } = useLanguage();
  const { user } = useUser();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    if (photos.length >= 5) {
      Alert.alert(t.error, t.maxPhotosReached);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - photos.length,
    });

    if (!result.canceled && result.assets) {
      const newPhotos = result.assets.map((asset) => asset.uri);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const takePhoto = async () => {
    if (photos.length >= 5) {
      Alert.alert(t.error, t.maxPhotosReached);
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert(t.error, t.pleaseSelectRating);
      return;
    }
    if (!comment.trim()) {
      Alert.alert(t.error, t.pleaseWriteComment);
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    Alert.alert(t.success, t.reviewSubmittedSuccessfully);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
          <Text style={[styles.companyName, { color: theme.text }]}>{cargoName}</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>{t.shareYourExperience}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.yourRating}</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starButton}>
                <Star
                  size={48}
                  color={star <= rating ? theme.warning : theme.border}
                  fill={star <= rating ? theme.warning : "transparent"}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={[styles.ratingText, { color: theme.secondaryText }]}>
              {rating === 5 && t.excellent}
              {rating === 4 && t.good}
              {rating === 3 && t.average}
              {rating === 2 && t.belowAverage}
              {rating === 1 && t.poor}
            </Text>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.yourReview}</Text>
          <TextInput
            style={[styles.textArea, { backgroundColor: theme.searchBackground, color: theme.text, borderColor: theme.border }]}
            placeholder={t.writeYourReviewHere}
            placeholderTextColor={theme.secondaryText}
            multiline
            numberOfLines={6}
            value={comment}
            onChangeText={setComment}
            textAlignVertical="top"
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.addPhotos}</Text>
          <Text style={[styles.photoHint, { color: theme.secondaryText }]}>{t.addUpTo5Photos}</Text>

          <View style={styles.photosGrid}>
            {photos.map((photo, index) => (
              <View key={index} style={styles.photoItem}>
                <Image source={{ uri: photo }} style={styles.photoImage} />
                <TouchableOpacity
                  style={[styles.removePhotoButton, { backgroundColor: theme.danger }]}
                  onPress={() => removePhoto(index)}
                >
                  <X size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 5 && (
              <View style={styles.addPhotoButtons}>
                <TouchableOpacity
                  style={[styles.addPhotoButton, { backgroundColor: theme.searchBackground, borderColor: theme.border }]}
                  onPress={pickImage}
                >
                  <Camera size={24} color={theme.primary} />
                  <Text style={[styles.addPhotoText, { color: theme.secondaryText }]}>{t.gallery}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.addPhotoButton, { backgroundColor: theme.searchBackground, borderColor: theme.border }]}
                  onPress={takePhoto}
                >
                  <Camera size={24} color={theme.primary} />
                  <Text style={[styles.addPhotoText, { color: theme.secondaryText }]}>{t.camera}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: rating > 0 && comment.trim() ? theme.primary : theme.border }]}
          onPress={handleSubmit}
          disabled={isSubmitting || rating === 0 || !comment.trim()}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>{t.submitReview}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 150,
  },
  photoHint: {
    fontSize: 13,
    marginBottom: 16,
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photoItem: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  removePhotoButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoButtons: {
    flexDirection: "row",
    gap: 8,
  },
  addPhotoButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  bottomPadding: {
    height: 100,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
  },
  submitButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700" as const,
  },
});
