import {
  IconBulbFilled,
  IconCheck,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  DragEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Prompt } from '@/types/prompt';
import { Plugin } from '@/types/plugin';
import { useTranslation } from 'next-i18next';
import { Message } from '@/types/chat';
import HomeContext from '@/pages/api/home/home.context';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';

import PromptbarContext from '../PromptBar.context';
import { PromptModal } from './PromptModal';
import { Chat } from '@/components/Chat/Chat';

interface Props {
  prompt: Prompt;
  onSend: (message: Message) => void;
  onRegenerate: () => void;
  onScrollDownClick: () => void;
}

export const PromptComponent = ({ prompt, onSend }: Props) => {
  const {
    dispatch: promptDispatch,
    handleUpdatePrompt,
    handleDeletePrompt,
  } = useContext(PromptbarContext);

  const {
    state: { messageIsStreaming},
    dispatch: homeDispatch,
  } = useContext(HomeContext);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const { t } = useTranslation('chat');
  const [plugin, setPlugin] = useState<Plugin | null>(null);

  const handleUpdate = (prompt: Prompt) => {
    handleUpdatePrompt(prompt);
    promptDispatch({ field: 'searchTerm', value: '' });
  };

  const handleDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();

    if (isDeleting) {
      handleDeletePrompt(prompt);
      promptDispatch({ field: 'searchTerm', value: '' });
    }

    setIsDeleting(false);
  };

  const handleCancelDelete: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
  };

  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  const handleDragStart = (e: DragEvent<HTMLButtonElement>, prompt: Prompt) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('prompt', JSON.stringify(prompt));
    }
  };

  const handleSendToAPI = async () => {
      if (messageIsStreaming) {
        return;
      }
  
      await onSend({ role: 'user', content: prompt.name,});
      setPlugin(null);
  
      //if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      //  textareaRef.current.blur();
      //}
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div className="relative flex items-center">
      
      <button
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90"
        draggable={!prompt.system}
        onClick={(e) => {  
          e.stopPropagation();
          if (!prompt.system) {
            setShowModal(true);
          } else {
            e.preventDefault();
            handleSendToAPI();
          }
        }}
        
        onDragStart={(e) => handleDragStart(e, prompt)}
        onMouseLeave={() => {
          setIsDeleting(false);
          setIsRenaming(false);
          setRenameValue('');
        }}
      >
        
        <IconBulbFilled size={18} />

        <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all pr-4 text-left text-[12.5px] leading-3">
          {prompt.name} 
        </div>
      </button>

      {!prompt.system && (isDeleting || isRenaming) && (
        <div className="absolute right-1 z-10 flex text-gray-300">
          <SidebarActionButton handleClick={handleDelete}>
            <IconCheck size={18} />
          </SidebarActionButton>

          <SidebarActionButton handleClick={handleCancelDelete}>
            <IconX size={18} />
          </SidebarActionButton>
        </div>
      )}

      {!prompt.system && !isDeleting && !isRenaming && (
        <div className="absolute right-1 z-10 flex text-gray-300">
          <SidebarActionButton handleClick={handleOpenDeleteModal}>
            <IconTrash size={18} />
          </SidebarActionButton>
        </div>
      )}

      {showModal && (
        <PromptModal
          prompt={prompt}
          onClose={() => setShowModal(false)}
          onUpdatePrompt={handleUpdate}
        />
      )}
      
    </div>
  );
};
