import { app, db } from '$lib/firebase/firebase';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	where
} from 'firebase/firestore';
import type { ImageRepository } from '$lib/core/repositories/imageRepository';
import type { Image } from '$lib/core/entities/Image';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import Compressor from 'compressorjs';
export class FirebaseImageAdapter implements ImageRepository {
	async saveImageForChat(image: Image, chatId: string): Promise<void> {
		const ImagesRef = await addDoc(collection(db, `chats/${chatId}/images`), {
			uploadedBy: image.uploadedBy,
			uploadedAt: serverTimestamp(),
			imageUrl: image.imageUrl,
			thumbnailUrl: image.thumbnailUrl,
			fileSize: image.fileSize,
			fileType: image.fileType
			// metaData: image.metadata
		});
	}
	async getImagesByChatId(ChatId: string): Promise<Image[]> {
		let images: Image[];
		try {
			const imgQuerySnap = query(
				collection(db, `chats/${ChatId}/images`),
				orderBy('uploadedAt', 'asc')
			);
			const querySnapshot = await getDocs(imgQuerySnap);
			images = querySnapshot.docs.map((doc) => doc.data() as Image);
		} catch (err) {
			console.log(err);
		}
		// @ts-ignore
		return images;
	}
	// async uploadImages(email: string, file: File, uid: string): Promise<Image> {
	// 	const storage = getStorage(app);
	// 	let compressedFile: File | Blob;
	// 	let compressedFileSize: number;
	// 	let compressedFileType: any;
	// 	let photoUrl: string = '';
	// 	const name = email + '_' + new Date().getTime() + '_' + file.name;
	// 	const storageRef = ref(storage, name);
	// 	async function compressAndUploadImage(file: File | Blob):Promise<Image> {
	// 		const comp = new Compressor(file, {
	// 			quality: 0.8, // the quality of the output image, the higher the better quality but larger file
	// 			maxWidth: 1024, // the max width of the output image
	// 			maxHeight: 1024, // the max height of the output image
	// 			success(result) {
	// 				compressedFile = result;
	// 				const uploadTask = uploadBytesResumable(storageRef, result);
	// 				compressedFileSize = result.size;
	// 				compressedFileType = file.type;
	// 				uploadTask.on(
	// 					'state_changed',
	// 					(snapshot: { bytesTransferred: number; totalBytes: number; state: any }) => {
	// 						const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	// 						console.log('Upload is ' + progress + '% done');
	// 						switch (snapshot.state) {
	// 							case 'paused':
	// 								console.log('Upload is paused');
	// 								break;
	// 							case 'running':
	// 								console.log('Upload is running');
	// 								break;
	// 						}
	// 					},
	// 					(error: any) => {
	// 						console.log(error);
	// 					},
	// 					() => {
	// 						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
	// 							photoUrl = downloadURL;
	// 							return {
	// 								uploadedBy: uid,
	// 								uploadedAt: new Date(),
	// 								imageUrl: downloadURL,
	// 								thumbnailUrl: downloadURL,
	// 								fileSize: compressedFileSize,
	// 								fileType: compressedFileType
	// 							};
	// 						});
	// 						// .then(() => {
	// 						// const part = [uid];
	// 						// // @ts-ignore
	// 						// const chatsRef = await addNewChatService(part);
	// 						// const img = {
	// 						// 	uploadedBy: uid,
	// 						// 	uploadedAt: new Date(),
	// 						// 	imageUrl: photoUrl,
	// 						// 	thumbnailUrl: photoUrl,
	// 						// 	fileSize: compressedFileSize,
	// 						// 	fileType: compressedFileType
	// 						// };
	// 						// // @ts-ignore
	// 						// const ImagesRef = await addImageToChatService(img, chatsRef.id);
	// 						// console.log(ImagesRef);
	// 						// goto(`/chats/${chatsRef.id}`);
	// 						// });
	// 					}
	// 				);
	// 			},
	// 			error(err) {
	// 				console.log(err.message);
	// 			}
	// 		});
	// 		console.log(
	// 			{
	// 				uploadedBy: uid,
	// 				uploadedAt: new Date(),
	// 				imageUrl: photoUrl,
	// 				thumbnailUrl: photoUrl,
	// 				fileSize: compressedFileSize,
	// 				fileType: compressedFileType
	// 			}
	// 		);
	// 		return {
	// 			uploadedBy: uid,
	// 			uploadedAt: {},
	// 			imageUrl: photoUrl,
	// 			thumbnailUrl: photoUrl,
	// 			fileSize: compressedFileSize,
	// 			fileType: compressedFileType
	// 		};
	// 	}
	// 	return await compressAndUploadImage(file);
	// 	// return {
	// 	// 	uploadedBy: uid,
	// 	// 	uploadedAt: new Date(),
	// 	// 	imageUrl: photoUrl,
	// 	// 	thumbnailUrl: photoUrl,
	// 	// 	fileSize: compressedFileSize,
	// 	// 	fileType: compressedFileType
	// 	// };
	// }
	async saveIndividualImageAndReturnId(chatId: string, image: Image): Promise<string> {
		const ImagesRef = await addDoc(collection(db, `chats/${chatId}/images`), {
			uploadedBy: image.uploadedBy,
			uploadedAt: serverTimestamp(),
			imageUrl:image.imageUrl,
			thumbnailUrl: image.thumbnailUrl,
			fileSize: image.fileSize,
			fileType: image.fileType
		});
		return ImagesRef.id;
	}
	async getImageById(imageId: string,chatId:string): Promise<Image> {
		const ImageDoc = (await getDoc(doc(db, `chats/${chatId}/images/${imageId}`))).data();
		return ImageDoc as Image;
	}
}
