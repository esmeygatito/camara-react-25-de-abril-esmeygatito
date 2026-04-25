import { useRef, useState } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);

  // Mientras los permisos no se han resuelto, no mostramos nada
  if (!permission) {
    return <View />;
  }

  // Si el permiso fue denegado, mostramos un botón para solicitarlo
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Necesitamos tu permiso para acceder a la cámara
        </Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  // Alterna entre cámara frontal y trasera
  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  async function tomarFoto() {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) setUri(photo.uri);
  }

  return (
    <View style={styles.container}>
      <CameraView ref={ref} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.captureButton} onPress={tomarFoto}>
            <Text style={styles.text}>Tomar foto</Text>
          </Pressable>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Voltear cámara</Text>
          </TouchableOpacity>
        </View>
        {uri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri }} style={styles.previewImage} />
          </View>
        ) : null}
        {uri ? <Text style={styles.uriText}>URI: {uri}</Text> : null}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    margin: 64,
  },
  captureButton: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  previewContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  previewImage: {
    width: 110,
    height: 160,
  },
  uriText: {
    color: 'white',
    fontSize: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
