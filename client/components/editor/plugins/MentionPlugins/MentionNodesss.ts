// import { DecoratorNode } from "lexical";

// export class MentionNode extends DecoratorNode<React.ReactNode> {
//   static getType(): string {
//     return "mention";
//   }

//   static clone(node: MentionNode): MentionNode {
//     return new MentionNode(node.__id, node.__text, node.__key);
//   }

//   constructor(private __id: string, private __text: string, key?: string) {
//     super(key);
//   }

//   createDOM(): HTMLElement {
//     const span = document.createElement("span");
//     span.className =
//       "bg-primary rounded-md px-2 py-1 text-sm text-primary pr-1";
//     span.textContent = `@${this.__text}`;
//     return span;
//   }

//   updateDOM(prevNode: MentionNode, dom: HTMLElement): boolean {
//     if (prevNode.__text !== this.__text) {
//       dom.textContent = `@${this.__text}`;
//     }
//     return false;
//   }

//   exportJSON() {
//     return { type: "mention", id: this.__id, text: this.__text };
//   }

//   static importJSON(data): MentionNode {
//     return new MentionNode(data.id, data.text);
//   }
// }
