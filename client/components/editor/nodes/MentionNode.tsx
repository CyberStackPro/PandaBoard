import {
  EditorConfig,
  NodeKey,
  SerializedTextNode,
  TextNode,
  // $createTextNode,
  // $isTextNode,
} from "lexical";

export class MentionNode extends TextNode {
  __mention: string;

  static getType(): string {
    return "mention";
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(mention: string, text?: string, key?: NodeKey) {
    super(text || mention);
    this.__mention = mention;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.color = "blue";
    dom.style.backgroundColor = "#e8f4fe"; /*  */
    dom.style.padding = "1px 4px";
    dom.style.borderRadius = "2px";
    dom.className =
      "mention rounded-md px-2 py-1 text-sm text-primary pr-1 bg-accent/10";
    return dom;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mention: this.__mention,
      type: "mention",
      version: 1,
    };
  }
}

export type SerializedMentionNode = SerializedTextNode & {
  mention: string;
  type: "mention";
  version: 1;
};

export function $createMentionNode(mention: string): MentionNode {
  return new MentionNode(mention);
}

export function $isMentionNode(node: LexicalNode): node is MentionNode {
  return node instanceof MentionNode;
}
