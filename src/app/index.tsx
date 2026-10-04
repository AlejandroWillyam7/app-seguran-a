import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setcarregando] = useState(false);

  function validarCampos() {
    if (email.trim() === ''){
      alert('Digite seu e-mail!');
      return false;
    }
    if(senha.trim() === '') {
    alert('Digite sua senha!');
    return false;
  }
  return true;
}
function fazerLogin() {
  if(!validarCampos()) {
    return;
  }
  setcarregando(true);

  setTimeout(() => {
    setcarregando(false);
    alert('Login realizado!');
  }, 2000);
}

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🔐 App Segurança</Text>

      <Text style={styles.label}>E-mail</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Senha</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <Pressable style={[styles.botao, carregando && styles.botaoDesabilitado]}
       onPress={fazerLogin}
       disabled={carregando}>
        <Text style={styles.textoBotao}> 
          {carregando ? 'Entrando...' : 'ENTRAR'} </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  titulo: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
  },

  botao: {
    // height: 50,
    borderRadius: 10,
    padding: 15,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111111',
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  }
});