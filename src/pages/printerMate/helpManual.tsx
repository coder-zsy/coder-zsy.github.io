import '@/locales/i18n';
import { useEffect, useState } from 'react';
import { Link } from 'umi';

import type { i18 } from '@/locales/resources';
import { useTranslation } from 'react-i18next';

type ItemData = {
  title: i18;
  content: i18;
  isOpen: boolean;
};

const DATA: ItemData[] = [
  { title: 'Faq_Problem1', content: 'Faq_Answer1', isOpen: false },
  { title: 'Faq_Problem2', content: 'Faq_Answer2', isOpen: false },
  {
    title: 'Faq_Problem3',
    content: 'Faq_Answer3',
    isOpen: false,
  },
  {
    title: 'Faq_Problem4',
    content: 'Faq_Answer4',
    isOpen: false,
  },
];

type ItemProps = {
  item: ItemData;
  onClick: () => void;
};
const Item = ({ item, onClick }: ItemProps) => {
  const { t } = useTranslation();

  return (
    <div style={styles.item}>
      <div onClick={onClick} style={styles.itemHeader}>
        <div style={styles.title}>
          <span style={{ fontSize: 14 }}>{t(item.title)}</span>
        </div>
      </div>
      {item.isOpen && (
        <div style={styles.content}>
          <div style={styles.text}>{t(item.content)}</div>
        </div>
      )}
    </div>
  );
};

export default function FAQScreen() {
  const { t } = useTranslation();
  const [listData, setListData] = useState<ItemData[]>(DATA);
  const renderItem = ({ item, index }: { item: ItemData; index: number }) => {
    const itemClick = (item: ItemData) => {
      let temp = [...listData];
      temp[index].isOpen = !temp[index].isOpen;
      setListData(temp);
    };
    return (
      <Item
        key={item.title + item.content + index}
        item={item}
        onClick={() => itemClick(item)}
      />
    );
  };
  useEffect(() => {
    document.title = t('Faq');
  }, []);
  return (
    <div style={styles.container}>
      <div style={styles.manualSection}>
        <Link to="/printerMate/instructionManual" style={styles.manualLink}>
          <div style={styles.manualTitle}>
            <span style={{ fontSize: 16, fontWeight: 'bold' }}>
              {t('InstructionManual')}
            </span>
            <span style={styles.linkArrow}>→</span>
          </div>
        </Link>
      </div>
      {listData.map((d, i) => {
        return renderItem({ item: d, index: i });
      })}
    </div>
  );
}

const styles = {
  container: {
    height: '100vh',
    backgroundColor: '#eee',
    overflowY: 'auto' as const,
  },
  flatList: {
    width: '100%',
  },
  item: {
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid' as const,
  },
  itemHeader: {
    width: '100%',
  },
  content: {
    paddingTop: 0,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
  },
  title: {
    minHeight: 40,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  text: {
    color: '#555',
    fontSize: 14,
    whiteSpace: 'pre-line',
    width: '100%',
    lineHeight: 1.4,
  },
  linkArrow: {
    marginLeft: 'auto',
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  manualSection: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    borderBottomStyle: 'solid' as const,
  },
  manualLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    width: '100%',
  },
  manualTitle: {
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
};
