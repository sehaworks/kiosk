import React, { useEffect } from 'react';
import styles from './GroupNoticeModal.module.css';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

// TODO: 단체 몇 명인지 알려주기
const GroupNoticeModal = ({ open, onClose, portalTarget }) => {
  const { t } = useTranslation('main');

  if (!open) return null;

  const groupSize = '20';

  // console.log('groupSize:', groupSize);
  // console.log(
  //   'translation result:',
  //   t('group_notice_modal.content', { groupSize })
  // );

  const content = (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-notice-title"
        onClick={(e) => e.stopPropagation()} // 오버레이 클릭으로만 닫히게
      >
        <div id="group-notice-title" className={styles.title}>
          {t('group_notice_modal.title')}
        </div>
        <div className={styles.content}>
          <p>
            {t('group_notice_modal.content', { groupSize })}
            <br />
          </p>
        </div>
        <button className={styles.okBtn} type="button" onClick={onClose}>
          {t('group_notice_modal.ok_button')}
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, portalTarget || document.body);
};

export default GroupNoticeModal;
