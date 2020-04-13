import React, {FunctionComponent, SVGProps} from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
    html: string;
}

const Icon: FunctionComponent<IconProps> = ({
    html,
    ...props
}) => (
    <svg
        {...props}
        dangerouslySetInnerHTML={{__html: html}}
    />
);

export default Icon;