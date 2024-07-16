import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { cloneElement, Children } from "@wordpress/element";

const cloneWithProps = (children, newProps) => {
	return Children.map(children, (child) => cloneElement(child, newProps));
};

export default function save() {
	const blockProps = useBlockProps.save();
	const { children, ...innerBlocksProps } = useInnerBlocksProps.save({
		className: "wp-block-wpcomsp-marquee__inner",
	});

	const inner = <div {...innerBlocksProps}>{children}</div>;
	const innerClone = cloneElement(inner);

	return (
		<div {...blockProps}>
			{inner}
			{innerClone}
		</div>
	);
}
