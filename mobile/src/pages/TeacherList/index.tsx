import React, { useState } from "react";
import { View, ScrollView, Text, TextInput, Alert } from "react-native";
import { BorderlessButton, RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-community/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import PageHeader from "../../components/PageHeader";
import TeacherItem, { Teacher } from "../../components/TeacherItem";

import api from "../../services/api";

import styles from "./styles";

const TeacherList: React.FC = () => {
  const [filtersAreVisible, setFiltersAreVisible] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const [teacherList, setTeacherList] = useState([]);

  const [subject, setSubject] = useState("");
  const [week_day, setWeekDay] = useState("");
  const [time, setTime] = useState("");

  function loadFavorites() {
    AsyncStorage.getItem("favorites").then((response) => {
      if (response) {
        const favoriteTeachers = JSON.parse(response);
        const favoriteTeachersIds = favoriteTeachers.map((teacher: Teacher) => {
          return teacher?.id;
        });

        setFavorites(favoriteTeachersIds);
      }
    });
  }

  useFocusEffect(() => {
    loadFavorites();
  });

  function handleToggleFilters() {
    setFiltersAreVisible(!filtersAreVisible);
  }

  async function handleFiltersSubmit() {
    loadFavorites();
    try {
      const response = await api.get("/classes", {
        params: {
          subject,
          week_day,
          time,
        },
      });

      setFiltersAreVisible(false);
      setTeacherList(response.data);
    } catch (error) {
      Alert.alert("Ocorreu um erro", "Verifique os dados e tente novamente");
    }
  }

  return (
    <View style={styles.container}>
      <PageHeader
        title="Proffys Disponíveis"
        headerRight={
          <BorderlessButton onPress={handleToggleFilters}>
            <Feather name="filter" size={20} color="#fff" />
          </BorderlessButton>
        }
      >
        {filtersAreVisible && (
          <>
            <View style={styles.searchForm}>
              <Text style={styles.label}>Matéria</Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                style={styles.input}
                placeholder="Qual a matéria?"
                placeholderTextColor="#c1bccc"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.inputBlock}>
                <Text style={styles.label}>Dia da semana</Text>

                <TextInput
                  style={styles.input}
                  value={week_day}
                  onChangeText={setWeekDay}
                  placeholder="Qual dia?"
                  placeholderTextColor="#c1bccc"
                />
              </View>

              <View style={styles.inputBlock}>
                <Text style={styles.label}>Horário</Text>

                <TextInput
                  style={styles.input}
                  value={time}
                  onChangeText={setTime}
                  placeholder="Qual horário?"
                  placeholderTextColor="#c1bccc"
                />
              </View>
            </View>
            <RectButton
              style={styles.submitButton}
              onPress={handleFiltersSubmit}
            >
              <Text style={styles.submitButtonText}>Filtrar</Text>
            </RectButton>
          </>
        )}
      </PageHeader>

      <ScrollView
        style={styles.teacherList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}
      >
        {teacherList.map((teacher: Teacher) => (
          <TeacherItem
            key={teacher?.id}
            teacher={teacher}
            isFavorite={favorites.includes(teacher?.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TeacherList;
