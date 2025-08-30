import React, {useEffect, useState} from "react";
import '@/locales/i18n';

import { useTranslation } from "react-i18next";
import type {i18} from "@/locales/resources";

type ItemData = {
	title: i18;
	content: i18;
	isOpen: boolean;
};

const DATA: ItemData[] = [
	{ title: "Faq_WhiteDotsA", content: "Faq_WhiteDotsQ", isOpen: false },
	{ title: "Faq_NotClearA", content: "Faq_NotClearQ", isOpen: false },
	{
		title: "Faq_PrintHorizontallyA",
		content: "Faq_PrintHorizontallyQ",
		isOpen: false,
	},
	{
		title: "Faq_PaperCannotComeOutA",
		content: "Faq_PaperCannotComeOutQ",
		isOpen: false,
	},
	{
		title: "Faq_CheckPaperStuckA",
		content: "Faq_CheckPaperStuckQ",
		isOpen: false,
	},
	{
		title: "Faq_ChargeTimeA",
		content: "Faq_ChargeTimeQ",
		isOpen: false,
	},
	{
		title: "Faq_ConnectStepsA",
		content: "Faq_ConnectStepsQ",
		isOpen: false,
	},
	{
		title: "Faq_PrintBlackA",
		content: "Faq_PrintBlackQ",
		isOpen: false,
	},
	{
		title: "Faq_BleConnectFailureA",
		content: "Faq_BleConnectFailureQ",
		isOpen: false,
	},
	{
		title: "Faq_NeedInkingA",
		content: "Faq_NeedInkingQ",
		isOpen: false,
	},
	{
		title: "Faq_PrintItInColorA",
		content: "Faq_PrintItInColorQ",
		isOpen: false,
	},
	{
		title: "Faq_PrintTextSmallA",
		content: "Faq_PrintTextSmallQ",
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
					<span style={{fontSize: 14}}>{t(item.title)}</span>
				</div>
			</div>
			{item.isOpen && (<div style={styles.content}>

					<span style={styles.text}>{t(item.content)}</span>

			</div>)}

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
		return <Item key={item.title+ item.content + index} item={item} onClick={() => itemClick(item)} />;
	};
	useEffect(() => {
		document.title = t('Faq')
	}, []);
	return (
		<div style={styles.container}>
			{listData.map((d, i) => {
				return renderItem({item: d, index: i})
			})}
		</div>
	);
}


const styles = {
	container: {
		height: '100vh',
		backgroundColor: "#eee",
		overflowY: 'auto' as const
	},
	flatList: {
		width: "100%",
	},
	item: {
		borderRadius: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#ddd",
		borderBottomStyle: 'solid' as const
	},
	itemHeader: {
		width: "100%",
	},
	content: {
		paddingTop: 0,
		paddingBottom: 10,
		paddingRight: 10,
		paddingLeft: 10
	},
	title: {
		minHeight: 40,
		display: "flex",
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10,
		paddingTop: 5,
		paddingBottom: 5,
	},
	text: {
		color: "#555",
		fontSize: 14,
	},
}

