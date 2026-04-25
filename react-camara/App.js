import { useRef, useState } from 'react';
import { Button, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isAccepted, setIsAccepted] = useState(false);

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
    if (isTakingPhoto) return;

    try {
      setIsTakingPhoto(true);
      setErrorMsg(null);
      const photo = await ref.current?.takePictureAsync();
      if (photo?.uri) {
        setUri(photo.uri);
        setIsAccepted(false);
      }
    } catch (error) {
      setErrorMsg('No se pudo tomar la foto. Intenta de nuevo.');
    } finally {
      setIsTakingPhoto(false);
    }
  }

  function repetirFoto() {
    setUri(null);
    setIsAccepted(false);
    setErrorMsg(null);
  }

  function aceptarFoto() {
    setIsAccepted(true);
  }

  return (
    <View style={styles.container}>
      <CameraView ref={ref} style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.captureButton,
              (pressed || isTakingPhoto) && styles.buttonDisabled,
            ]}
            onPress={tomarFoto}
            disabled={isTakingPhoto}
          >
            <Text style={styles.text}>{isTakingPhoto ? 'Tomando foto...' : 'Tomar foto'}</Text>
          </Pressable>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing} disabled={isTakingPhoto}>
            <Text style={styles.text}>Voltear cámara</Text>
          </TouchableOpacity>
        </View>
        {uri ? (
          <View style={styles.actionsContainer}>
            <Pressable style={styles.actionButton} onPress={repetirFoto}>
              <Text style={styles.actionText}>Repetir</Text>
            </Pressable>
            <Pressable style={styles.actionButton} onPress={aceptarFoto}>
              <Text style={styles.actionText}>Aceptar</Text>
            </Pressable>
          </View>
        ) : null}
        {uri ? (
          <View style={styles.previewContainer}>
            <Image source={{ uri }} style={styles.previewImage} />
          </View>
        ) : null}
        {isAccepted ? <Text style={styles.successText}>Foto aceptada</Text> : null}
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
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
  buttonDisabled: {
    opacity: 0.6,
  },
  actionsContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  previewContainer: {
    position: 'absolute',
    top: 90,
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
  successText: {
    color: '#7CFC00',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  errorText: {
    color: '#FF4C4C',
    fontSize: 14,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
