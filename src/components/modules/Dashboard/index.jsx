import { useEffect, useRef, useState } from 'react'
import Img1 from '../../../assets/img1.jpg'
import Input from '../../Input'
import { io } from 'socket.io-client'
import Styles from './chat.module.css'

const Dashboard = () => {
	const [user, setUser] = useState(JSON.parse(localStorage.getItem('user:detail')));
	const [conversations, setConversations] = useState([]);
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState('');
	const [users, setUsers] = useState([]);
	const [socket, setSocket] = useState(null);
	const messageRef = useRef(null);

	useEffect(() => {
		const socket = io('http://localhost:8080');

		socket.emit('addUser', user?.id);

		socket.on('getUsers', (activeUsers) => {
			console.log('activeUsers :>> ', activeUsers);
		});

		socket.on('getMessage', (data) => {
			setMessages((prev) => [...prev, { user: data.user, message: data.message }]);
		});

		// Cleanup on unmount
		return () => {
			socket.disconnect();
		};
	}, [user]);

	useEffect(() => {
		messageRef?.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	useEffect(() => {
		let isMounted = true;

		const fetchConversations = async () => {
			try {
				const res = await fetch(`http://localhost:8080/api/Conversations/${user?.id}`);
				if (isMounted && res.ok) {
					const resData = await res.json();
					setConversations(resData);
				}
			} catch (error) {
				console.error('Error fetching conversations:', error);
			}
		};

		fetchConversations();

		return () => {
			isMounted = false;
		};
	}, [user]);

	useEffect(() => {
		let isMounted = true;

		const fetchUsers = async () => {
			try {
				const res = await fetch(`http://localhost:8080/api/users/${user?.id}`);
				if (isMounted && res.ok) {
					const resData = await res.json();
					setUsers(resData);
				}
			} catch (error) {
				console.error('Error fetching users:', error);
			}
		};

		fetchUsers();

		return () => {
			isMounted = false;
		};
	}, [user]);

	const fetchMessages = async (conversationId, receiver) => {
		const res = await fetch(
			`http://localhost:8080/api/message/${conversationId}?senderId=${user?.id}&&receiverId=${receiver?.receiverId}`
		);
		const resData = await res.json();
		setMessages(resData);
	};

	const sendMessage = async () => {
		if (!message.trim()) {
			return;
		}

		setMessage('');
		socket?.emit('sendMessage', {
			senderId: user?.id,
			receiverId: messages?.receiver?.receiverId,
			message,
			conversationId: messages?.conversationId,
		});

		await fetch(`http://localhost:8080/api/message`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				conversationId: messages?.conversationId,
				senderId: user?.id,
				message,
				receiverId: messages?.receiver?.receiverId,
			}),
		});
	};


	return (
		<>
			<div className={Styles.main_chat}>
				<div className={Styles.sub_screen}>
					<div className={Styles.profile}>
						<h3>{user?.fullName}</h3>
						<p>My Account</p>
					</div>
				</div>
				<hr />
				<div className={Styles.meessage}>
					<div>Messages</div>
					<div>
						{
							conversations.length > 0 ?
								conversations.map(({ conversationId, user }) => {
									return (
										<div className={Styles.conversation}>
											<div className='cursor-pointer flex items-center' onClick={() => fetchMessages(conversationId, user)}>
												<div><img src={Img1} alt='' className="w-[60px] h-[60px] rounded-full p-[2px] border border-primary" /></div>
												<div className='ml-6'>
													<h3 className='text-lg font-semibold'>{user?.fullName}</h3>
													<p className='text-sm font-light text-gray-600'>{user?.email}</p>
												</div>
											</div>
										</div>
									)
								}) : <div className={Styles.no_conversation}>No Conversations</div>
						}
					</div>
				</div>
			</div>
			<div className=' '>
				{
					messages?.receiver?.fullName &&
					<div className={Styles.msg}>
						<div className={Styles.msg_box}>
							<h3>{messages?.receiver?.fullName}</h3>
							<p>{messages?.receiver?.email}</p>
						</div>
						<div>
							<svg xmlns="http://www.w3.org/2000/svg" className={Styles.phone_icon}>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
								<line x1="15" y1="9" x2="20" y2="4" />
								<polyline points="16 4 20 4 20 8" />
							</svg>
						</div>
					</div>
				}
				<div className={Styles.scroll_container}>
					<div className='p-14'>
						{
							messages?.messages?.length > 0 ?
								messages.messages.map(({ message, user: { id } = {} }) => {
									return (
										<>
											<div className={`container ${id === user?.id ? 'container-user' : 'container-secondary'}`}>{message}</div>
											<div ref={messageRef}></div>
										</>
									)
								}) : <div className={Styles.text}>No Messages or No Conversation Selected</div>
						}
					</div>
				</div>
				{
					messages?.receiver?.fullName &&
					<div className={Styles.display_chat}>
						<input placeholder='Type a message...' value={message} onChange={(e) => setMessage(e.target.value)} className={Styles.custom_input} />
						<div className={`${Styles.custom_button} ${!message ? Styles.disabled : ''}`} onClick={() => sendMessage()}>
							<svg xmlns="http://www.w3.org/2000/svg" className={Styles.icon_send}>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<line x1="10" y1="14" x2="21" y2="3" />
								<path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
							</svg>
						</div>
						<div className={`${Styles.custom_button} ${!message ? Styles.disabled : ''}`}>
							<svg xmlns="http://www.w3.org/2000/svg" className={Styles.icon_send}>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<circle cx="12" cy="12" r="9" />
								<line x1="9" y1="12" x2="15" y2="12" />
								<line x1="12" y1="9" x2="12" y2="15" />
							</svg>
						</div>
					</div>
				}
			</div>
			<div className={Styles.chat_container}>
				<div className={Styles.m_text}>People</div>
				<div>
					{
						users.length > 0 ?
							users.map(({ userId, user }) => {
								return (
									<div className={Styles.msg_1_container}>
										<div className={Styles.text_1_container} onClick={() => fetchMessages('new', user)}>
											<div className={Styles.ml}>
												<h3>{user?.fullName}</h3>
												<p>{user?.email}</p>
											</div>
										</div>
									</div>
								)
							}) : <div className={Styles.no_conversation}>No Conversations</div>
					}
				</div>
			</div>
		</>
	)
}

export default Dashboard