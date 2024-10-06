class ListNode {
  data: any;
  next: ListNode | null;

  constructor(data: any) {
    this.data = data;
    this.next = null;
  }
}

export class LinkedList {
  headNode: ListNode | null;
  tailNode: ListNode | null;

  constructor(initialData?: any) {
    // 리스트 초기화 시, data가 있을 경우 첫 노드를 생성하고, 없으면 빈 리스트로 설정
    if (initialData !== undefined) {
      const newNode = new ListNode(initialData);
      this.headNode = newNode;
      this.tailNode = newNode;
    } else {
      this.headNode = null;
      this.tailNode = null;
    }
  }

  // 새로운 노드를 리스트의 끝에 추가
  addNode(data: any): void {
    const newNode = new ListNode(data);

    // 리스트가 비어있을 경우 새로운 노드를 head와 tail로 설정
    if (this.tailNode === null) {
      this.headNode = newNode;
      this.tailNode = newNode;
    } else {
      this.tailNode.next = newNode; // tail 뒤에 새 노드 추가
      this.tailNode = newNode; // tail을 새로운 노드로 갱신
    }
  }

  // 첫 번째 노드를 제거하고 다음 노드를 head로 설정
  popNode(): void {
    if (this.headNode === null) {
      // 리스트가 비어 있을 때 처리
      throw new Error('Cannot pop from an empty list.');
    }

    this.headNode = this.headNode.next;

    // 만약 리스트가 비게 되었을 경우 tail도 null로 설정
    if (this.headNode === null) {
      this.tailNode = null;
    }
  }

  // 리스트가 비어있는지 여부 확인
  isEmpty(): boolean {
    return this.headNode === null;
  }
}
