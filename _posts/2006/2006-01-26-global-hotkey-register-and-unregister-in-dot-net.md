---
title: .Net 下全局 HotKey Register & Unregister
date: 2006-01-26 09:17:08 + 0080
category: [.Net/Java]
tags: [C#, GUI]
---

本文介绍了，在.Net下实现，用系统API注册系统HotKey的全过程。将系统的WM_HOTKEY Message包装成了一个.Net下的Event(用户定义的HotKeyPress Event)。同时简化了系统HotKey的注册过程。  

### HotKey的注册原理

注册一个HotKey需要下面2个步骤：  
**1. Import GlobalAddAtom**
```c#
[DllImport("kernel32")]   
internal static extern IntPtr GlobalAddAtom(string lpString); 
``` 
GlobalAddAtom是一个系统提供的API，在Kernel32.dll下，这个方法将注册一个字符串到系统的Global Atom Table中，并返回一个唯一的intPtr指示识别这个字符串。  

**2. Import RegisterHotKey**
```c#
[DllImport("user32")]  
internal static extern bool RegisterHotKey(IntPtr hWnd,  
int id,  
uint fsModifiers,  
uint vk  
);
```
RegisterHotKey 是一个系统提供的 API，在user32.dll下，这个方法将注册一个HotKey。注册HotKey时需要使用一个AtomID一个系统唯一的标识来注册这个HotKey，当HotKey按下时，系统会发出一个`WM_HOTKEY`的Message给注册这个HotKey的Application。当这个Application收到消息后作自己想要的操作。  

### HotKey的使用方法
本文已经包装了HotKey的 `WM_HOTKEY` 系统 Message 为 `HotKeyPressed` `PrintWindowPressed` `PrintDesktopPressed` 事件(用户定义的事件)，注册 HotKey 时，使用类似 `this.HotKeys.Add(new HotKeyController.HotKey("Ctrl+O",Keys.O,HotKey.HotKeyModifiers.MOD_CONTROL))`; 来注册这个 HotKey。  
需要处理HotKey时使用`private void MainForm_HotKeyPressed(object sender, HotKeyController.HotKeyPressedEventArgs e)` 来处理 HotKeyEvent。进行自己想做的操作。  

### 部分核心代码  
**1. 使用到的系统API**
```c#
using System;
using System.Runtime.InteropServices;  
namespace HotKeyController  
{  
    public class HotKeyUnmanagedMethods  
    {  
        public HotKeyUnmanagedMethods()  
        {  
        }  

        ~ HotKeyUnmanagedMethods()  
        {  
        }  

        internal static int WM_HOTKEY = 0x312;  

        [DllImport("user32")]  
        internal static extern bool RegisterHotKey(IntPtr hWnd,  
        int id,  
        uint fsModifiers,  
        uint vk  
        );  

        [DllImport("user32")]   
        internal static extern bool UnregisterHotKey(IntPtr hWnd,  
        int id  
        );  

        [DllImport("kernel32")]   
        internal static extern IntPtr GlobalAddAtom(string lpString  
        );  

        [DllImport("kernel32")]   
        internal static extern IntPtr GlobalDeleteAtom(IntPtr nAtom  
        );  

        [DllImport("kernel32")]   
        internal static extern uint GetTickCount();  
    }  
}  
```

**2. HotKey类 封装HotKey**
```c#
using System;  
using System.Windows.Forms;  
namespace HotKeyController  
{  
    public class HotKey  
    {  

        [Flags()]  
        public enum HotKeyModifiers  
        {  
            MOD_ALT = 0x1,  
            MOD_CONTROL = 0x2,  
            MOD_SHIFT = 0x4,  
            MOD_WIN = 0x8,  
        }  

        public HotKey(string name,Keys keyCode,HotKeyModifiers modifiers)  
        {  
            this._name = name;  
            this._keyCode = keyCode;  
            this._modifiers = modifiers;  
        }  

        public HotKey()  
        {  
        }  

        ~HotKey()  
        {  
        }  

        //The hot key is or not valiable.  
        public void Validate()  
        {  
            string message = "";  
            if(this._name.Trim().Length == 0)  
            {  
                message = "A hotkey need a name.";  
            }

            if(this._keyCode == Keys.Alt || this._keyCode == Keys.Control ||  
            this._keyCode == Keys.Shift || this._keyCode == Keys.ShiftKey ||  
            this._keyCode == Keys.ControlKey)  
            {  
                message = "The keycode cannot be set to a modifier key.";  
            }  
            if(message.Length > 0)  
            {  
                throw new HotKeyException(this,message);  
            }  
        }  

        public string Name  
        {  
            get  
            {  
                return this._name;  
            }  
            set  
            {  
                this._name = value;  
            }  
        }

        public Keys KeyCode  
        {  
            get  
            {  
                return this._keyCode;  
            }  
            set  
            {  
                this._keyCode = value;  
            }  
        }

        public HotKeyModifiers Modifiers  
        {  
            get  
            {  
                return this._modifiers;  
            }  
            set  
            {  
                this._modifiers = value;  
            }  
        }  

        private string _name;  
        private string _atomName;  
        private IntPtr _atomId;  
        private Keys _keyCode;  
        private HotKeyModifiers _modifiers;  

        //The Atom id will regist to the global system table.  
        internal IntPtr AtomId  
        {  
            get  
            {  
                return this._atomId;  
            }  
            set  
            {  
                this._atomId = value;  
            }  
        }  

        //The global atom name.  
        internal string AtomName  
        {  
            get  
            {  
                return this._atomName;  
            }  
            set  
            {  
                this._atomName = value;  
            }  
        }
    }  
}  
```

**3. HotKey Collection HotKey 的集合 存储管理 所有注册的HotKey**
```c#
using System;  
namespace HotKeyController  
{  
    public class HotKeyCollection:System.Collections.CollectionBase  
    {  
        //the hot key collections owner form.  
        public HotKeyCollection(System.Windows.Forms.Form ownerForm)  
        {  
            this._ownerForm = ownerForm;  
        }  

        //Get a hot key.  
        public HotKey this[int index]  
        {  
            get  
            {  
                return (HotKey)this.InnerList[index];  
            }  
        }  

        //Add a hot key.  
        public void Add(HotKey hotKey)  
        {  
            hotKey.Validate();  
            this.AddHotKey(hotKey);  
            this.InnerList.Add(hotKey);  
        }  

        //Remove a hot key.  
        public void Remove(HotKey hotKey)  
        {  
            hotKey.Validate();  
            this.RemoveHotKey(hotKey);  
            this.InnerList.Remove(hotKey);  
        }  

        public void Remove(int index)  
        {  
            if(index>=this.InnerList.Count)  
            {  
                return;  
            }  
            else  
            {  
                this.RemoveHotKey((HotKey)this.InnerList[index]);  
                this.InnerList.RemoveAt(index);  
            }  
        }  

        public void RemoveAll()  
        {  
            while(this.InnerList.Count>0)  
            {  
                this.RemoveHotKey((HotKey)this.InnerList[0]);  
                this.InnerList.RemoveAt(0);  
            }  
        } 

        private System.Windows.Forms.Form _ownerForm;  

        //Real add a hot key to system, use unmanagement methods.  
        private void AddHotKey(HotKey hotKey)  
        {  
            string atomName;  
            IntPtr atomId;  
            bool registered;  

            //get a atom name  
            atomName = hotKey.Name + "_" + HotKeyUnmanagedMethods.GetTickCount().ToString();  
            if(atomName.Length > 255)  
            {  
                atomName = atomName.Substring(0,255);  
            }  
            atomId = HotKeyUnmanagedMethods.GlobalAddAtom(atomName);  

            //get a tom id  
            if(atomId.Equals(IntPtr.Zero))  
            {  
                throw new HotKeyException(hotKey,"Failed to add a global atom for this HotKey");  
            }  
            else  
            {  
                //regist a hot key.  
                registered = HotKeyUnmanagedMethods.RegisterHotKey(this._ownerForm.Handle,atomId.ToInt32(),System.Convert.ToUInt32(hotKey.Modifiers), System.Convert.ToUInt32(hotKey.KeyCode));  
                if(!registered)  
                {  
                    //unsuccessful.  
                    HotKeyUnmanagedMethods.GlobalDeleteAtom(atomId);  
                    throw new HotKeyException(hotKey,"Failed to register this HotKey");  
                }  
                else  
                {  
                    //successful.  
                    hotKey.AtomName = atomName;  
                    hotKey.AtomId = atomId;  
                }  
            }
        }

        //Real remove a hot key, use unmanagement methods.   
        private void RemoveHotKey(HotKey hotKey)  
        {  
            // remove the hot key:  
            HotKeyUnmanagedMethods.UnregisterHotKey(this._ownerForm.Handle, hotKey.AtomId.ToInt32());  
            // unregister the atom:  
            HotKeyUnmanagedMethods.GlobalDeleteAtom(hotKey.AtomId);  
        }  

        //Clean all hot keys.  
        protected override void OnClear()  
        {  
            foreach(HotKey hotKey in this.InnerList)  
            {  
                this.RemoveHotKey(hotKey);  
            }  
            base.OnClear ();  
        }  

        protected override void OnInsert(int index, object value)  
        {  
            if(value.GetType().IsInstanceOfType(new HotKey()))  
            {  
                ((HotKey)value).Validate();  
                this.AddHotKey((HotKey)value);  
                base.OnInsert (index, value);  
            }  
            else  
            {  
                throw new InvalidCastException("The want to insert object is no a hotkey");  
            }  
        }  

        protected override void OnRemove(int index, object value)  
        {  
            if(value.GetType().IsInstanceOfType(new HotKey()))  
            {  
                this.RemoveHotKey((HotKey)value);  
                base.OnRemove(index, value);  
            }  
            else  
            {  
                throw new InvalidCastException("The want to remove object is no a hotkey");  
            }   
        }  

        protected override void OnSet(int index, object oldValue, object newValue)  
        {  
            HotKey hotKey;  
            hotKey = new HotKey();  

            if(oldValue.GetType().IsInstanceOfType(hotKey)&&newValue.GetType().IsInstanceOfType(newValue))  
            {  
                base.OnSet (index, ((HotKey)oldValue), ((HotKey)newValue));  
            }  
            else  
            {  
                throw new InvalidCastException("The want to set object is no a hotkey");  
            }   

        }  

        protected override void OnValidate(object value)  
        {  
            ((HotKey)value).Validate();  
        }
    }  
}
```
其中的 Private AddHotKey RemoveHotKey 调用了 系统的API 真正的注册一个HotKey 注销 一个HotKey。  

**4. HotKey Controller 重写窗体的WndProc方法 接收WM_HOTKEY Message 同时触发 HotKey Event 供Controller 的父类接收处理**
```c#
using System;  
namespace HotKeyController  
{  
    public delegate void HotKeyPressedEventHandler(object sender, HotKeyPressedEventArgs e);  

    public class HotKeyController : System.Windows.Forms.Form  
    {
        public HotKeyController()  
        {  
            this._hotKeys = new HotKeyCollection(this);  
        }  

        ~HotKeyController()  
        {  
            this._hotKeys.Clear();  
        }  
        
        public event HotKeyPressedEventHandler HotKeyPressed;  
        public HotKeyCollection HotKeys  
        {  
            get  
            {  
                return this._hotKeys;  
            }  
        }  

        private HotKeyCollection _hotKeys;  
        protected override void WndProc(ref System.Windows.Forms.Message m)  
        {  
            base.WndProc (ref m);  
            if (m.Msg == HotKeyUnmanagedMethods.WM_HOTKEY)  
            {  
                foreach (HotKey hotKey in this._hotKeys)  
                {  
                    if (hotKey.AtomId.Equals(m.WParam))  
                    {  
                        HotKeyPressedEventArgs hotKeyArgs = new HotKeyPressedEventArgs(hotKey);  
                        if (this.HotKeyPressed != null)  
                        {  
                            this.HotKeyPressed(this, hotKeyArgs);  
                        }  
                    }  
                }  
            }  
        }
    }  
}  
```

**5. HotKeyController 父类窗体对HotKey的处理**
添加事件处理方法
```c#
this.HotKeyPressed +=new HotKeyPressedEventHandler(MainForm_HotKeyPressed);

//从HotKeyPressedEventArgs中得到Press的HotKey  
private void MainForm_HotKeyPressed(object sender, HotKeyController.HotKeyPressedEventArgs e)  
{  
    if(e.PressedHotKey!= null)  
    {  
        MessageBox.Show("Hot key "+e.PressedHotKey.Name +" Pressed","A hot key pressed",MessageBoxButtons.OK,MessageBoxIcon.Information);  
    }  
}  
```

[**源代码**](/assets/attachments/2006/01/26_100712_oldrHotKeySample.rar)
