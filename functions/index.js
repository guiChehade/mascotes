const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createPet = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const { mascotinho, aniversario, raca, tutor, rg, cpf, endereco, email, celularTutor, veterinario, enderecoVet, celularVetComercial, celularVetPessoal } = data;

  try {
    await admin.firestore().collection('pets').add({
      mascotinho,
      aniversario,
      raca,
      tutor,
      rg,
      cpf,
      endereco,
      email,
      celularTutor,
      veterinario,
      enderecoVet,
      celularVetComercial,
      celularVetPessoal,
      createdBy: context.auth.uid
    });
    return { message: "Pet cadastrado com sucesso!" };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});

exports.createUser = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The function must be called while authenticated.'
    );
  }

  const { username, password, isOwner, isAdmin, isEmployee, isTutor } = data;

  try {
    const userRef = admin.firestore().collection('users').doc(username);
    await userRef.set({
      username,
      password,
      isOwner,
      isAdmin,
      isEmployee,
      isTutor,
      createdBy: context.auth.uid
    });
    return { message: "Usuário cadastrado com sucesso!" };
  } catch (error) {
    throw new functions.https.HttpsError('unknown', error.message, error);
  }
});
