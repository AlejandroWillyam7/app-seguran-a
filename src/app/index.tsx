import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [verificandoLogin, setVerificandoLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
  verificarLogin();
}, []);

async function verificarLogin() {
  try {
    console.log('1 - Verificando token...');

    const token = await SecureStore.getItemAsync('token');

    console.log('2 - Token:', token ? 'Existe' : 'Não existe');

    if (!token) {
      setVerificandoLogin(false);
      return;
    }

    console.log('3 - Consultando /perfil...');

    const resposta = await fetch(
      'http://10.0.0.83:3000/perfil',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('4 - Resposta recebida:', resposta.status);

    if (resposta.ok) {
      setAutenticado(true);
    } else {
      await SecureStore.deleteItemAsync('token');
      setAutenticado(false);
    }

    setVerificandoLogin(false);

  } catch (erro) {
    console.log('ERRO AO VERIFICAR LOGIN:', erro);
    setVerificandoLogin(false);
  }
}

  function validarCampos() {
    if (email.trim() === '') {
      alert('Digite seu e-mail!');
      return false;
    }

    if (senha.trim() === '') {
      alert('Digite sua senha!');
      return false;
    }

    return true;
  }

  async function fazerLogin() {
    if (!validarCampos()) {
      return;
    }

    setCarregando(true);

    try {
      console.log('1 - Enviando login...');

      const resposta = await fetch(
        'http://10.0.0.83:3000/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            senha: senha,
          }),
        }
      );

      console.log('2 - API respondeu!');

      const dados = await resposta.json();

      console.log('3 - Dados recebidos:', dados);

      if (dados.token) {
        console.log('4 - Salvando token...');

        await SecureStore.setItemAsync(
          'token',
          dados.token
        );

        setAutenticado(true);

        console.log('5 - Token salvo!');
      }

      alert(dados.mensagem);
    } catch (erro) {
      console.log('ERRO:', erro);
      alert('Erro ao conectar com a API.');
    } finally {
      setCarregando(false);
    }
  }

  async function acessarPerfil() {
    try {
      const token =
        await SecureStore.getItemAsync('token');

      if (!token) {
        alert('Você não está autenticado.');
        return;
      }

      const resposta = await fetch(
        'http://10.0.0.83:3000/perfil',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dados = await resposta.json();

      alert(
  `${dados.mensagem}\nE-mail: ${dados.usuario.email}`
);
    } catch (erro) {
      console.log('ERRO:', erro);
      alert('Erro ao acessar o perfil.');
    }
  }

  async function sair() {
    await SecureStore.deleteItemAsync('token');

    setAutenticado(false);

    alert('Você saiu da conta!');
  }

  return (
    <View style={styles.container}>
      {verificandoLogin ? (
  <Text style={styles.titulo}>
    🔐 Verificando segurança...
  </Text>
) : autenticado ?  (
        <>
          <Text style={styles.titulo}>
            👤 Perfil
          </Text>

          <Text style={styles.label}>
            Bem-vindo!
          </Text>

          <Text style={styles.label}>
            {email}
          </Text>

          <Pressable
            style={styles.botao}
            onPress={acessarPerfil}
          >
            <Text style={styles.textoBotao}>
              VER PERFIL
            </Text>
          </Pressable>

          <Pressable
            style={styles.botao}
            onPress={sair}
          >
            <Text style={styles.textoBotao}>
              SAIR
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.titulo}>
            🔐 App Segurança
          </Text>

          <Text style={styles.label}>
            E-mail
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>
            Senha
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />

          <Pressable
            style={[
              styles.botao,
              carregando &&
                styles.botaoDesabilitado,
            ]}
            onPress={fazerLogin}
            disabled={carregando}
          >
            <Text style={styles.textoBotao}>
              {carregando
                ? 'Entrando...'
                : 'ENTRAR'}
            </Text>
          </Pressable>
        </>
      )}
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
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    backgroundColor: '#111111',
    marginBottom: 12,
  },

  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  botaoDesabilitado: {
    opacity: 0.5,
  },
});