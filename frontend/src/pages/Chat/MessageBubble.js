import PropTypes from 'prop-types';
import styles from '../../assets/styles/Chat.module.css';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MessageBubble = ({ text, isUser, timestamp }) => {
  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.ai}`}>
      <div className={styles.avatar}>
         {isUser ? '👤' : '🤖'}
      </div>
      <div className={styles.content}>
        <div className={styles.text}>  
		<ReactMarkdown remarkPlugins={[remarkGfm]}>
             {text}
        </ReactMarkdown>
		</div>
        <div className={styles.timestamp}>
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

MessageBubble.propTypes = {
  text: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired
};

export default MessageBubble;