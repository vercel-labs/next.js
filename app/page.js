'use client'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, padding: 24, backgroundColor: '#eef' },
  box: { width: 120, height: 120, backgroundColor: 'tomato', alignItems: 'center', justifyContent: 'center' },
  label: { color: 'white', fontSize: 20, fontWeight: 'bold' },
})

export default function Page() {
  return (
    <View style={styles.row}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.box}>
          <Text style={styles.label}>Box {i}</Text>
        </View>
      ))}
    </View>
  )
}
